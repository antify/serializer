import {
  type SerializerInterface,
  type EncoderInterface,
  type DecoderInterface,
  type NormalizerInterface,
  type DenormalizerInterface, UnsupportedFormatError
} from './types';

export function defineSerializer<LeftType, DTOType, RightType>(
  normalizers: Array<NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>>
    | NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>,
  encoders: Array<EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>> |
    EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>,
): Serializer<LeftType, DTOType, RightType> {
  return new Serializer<LeftType, DTOType, RightType>(normalizers, encoders);
}

export class Serializer<LeftType, DTOType, RightType> implements SerializerInterface<LeftType, RightType>,
  NormalizerInterface<LeftType, DTOType>,
  DenormalizerInterface<LeftType, DTOType>,
  EncoderInterface<DTOType, RightType>,
  DecoderInterface<DTOType, RightType> {
  private normalizers: Array<NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>> = [];
  private encoders: Array<EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>> = [];

  constructor(
    normalizers: Array<NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>> |
      NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>,
    encoders: Array<EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>> |
      EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>
  ) {
    if (!Array.isArray(normalizers)) {
      normalizers = [normalizers];
    }

    if (!Array.isArray(encoders)) {
      encoders = [encoders];
    }

    this.normalizers = normalizers;
    this.encoders = encoders;
  }

  /**
   * Serialize data into RightType format.
   *
   * @throws UnsupportedFormatError
   */
  async serialize(data: LeftType): Promise<RightType> {
    return this.encode(await this.normalize(data));
  }

  /**
   * Deserialize data into LeftType format.
   *
   * @throws UnsupportedFormatError
   */
  async deserialize(data: RightType): Promise<LeftType> {
    return this.denormalize(await this.decode(data));
  }

  /**
   * Normalize data into DTO format.
   *
   * @throws UnsupportedFormatError
   */
  async normalize(data: LeftType): Promise<DTOType> {
    const normalizer = this.normalizers.find(normalizer =>
      normalizer.supportsNormalization === undefined ? true : normalizer?.supportsNormalization(data));

    if (!normalizer) {
      throw new UnsupportedFormatError(`Normalization is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined a normalizer for this data type.`);
    }

    return normalizer.normalize(data);
  }

  /**
   * Denormalize data into LeftType format.
   *
   * @throws UnsupportedFormatError
   */
  async denormalize(data: DTOType): Promise<LeftType> {
    const normalizer = this.normalizers.find(denormalizer =>
      denormalizer.supportsDenormalization === undefined ? true : denormalizer.supportsDenormalization(data));

    if (!normalizer) {
      throw new UnsupportedFormatError(`Denormalization is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined a denormalizer for this data type.`);
    }

    return normalizer.denormalize(data);
  }

  /**
   * Encode data into RightType format.
   *
   * @throws UnsupportedFormatError
   */
  async encode(data: DTOType): Promise<RightType> {
    const encoder = this.encoders.find(encoder =>
      encoder.supportsEncoding === undefined ? true : encoder.supportsEncoding(data));

    if (!encoder) {
      throw new UnsupportedFormatError(`Encoding is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined an encoder for this data type.`);
    }

    return encoder.encode(data);
  }

  /**
   * Decode data into DTOType format.
   *
   * @throws UnsupportedFormatError
   */
  async decode(data: RightType): Promise<DTOType> {
    const encoder = this.encoders.find(decoder =>
      decoder.supportsDecoding === undefined ? true : decoder.supportsDecoding(data));

    if (!encoder) {
      throw new UnsupportedFormatError(`Decoding is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined a decoder for this data type.`);
    }

    return encoder.decode(data);
  }
}

export function defineNormalizer<LeftType, DTOType>(
  normalizer: NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>
): NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType> {
  return normalizer;
}

export function defineEncoder<DTOType, RightType>(
  encoder: EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>
): EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType> {
  return encoder;
}


