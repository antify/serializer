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

export class Serializer<LeftType, DTOType, RightType> implements SerializerInterface<LeftType, RightType> {
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
   * Serialize data into the given format.
   *
   * @throws UnsupportedFormatError
   */
  async serialize(data: LeftType): Promise<RightType> {
    const normalizer = this.normalizers.find(normalizer =>
      normalizer.supportsNormalization === undefined ? true : normalizer?.supportsNormalization(data));

    if (!normalizer) {
      throw new UnsupportedFormatError(`Normalization is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined a normalizer for this data type.`);
    }

    const normalizedData = await normalizer.normalize(data);
    const encoder = this.encoders.find(encoder =>
      encoder.supportsEncoding === undefined ? true : encoder.supportsEncoding(normalizedData));

    if (!encoder) {
      throw new UnsupportedFormatError(`Encoding is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined an encoder for this data type.`);
    }

    return encoder.encode(normalizedData);
  }

  /**
   * Deserialize data into the given format.
   *
   * @throws UnsupportedFormatError
   */
  async deserialize(data: RightType): Promise<LeftType> {
    const encoder = this.encoders.find(decoder =>
      decoder.supportsDecoding === undefined ? true : decoder.supportsDecoding(data));

    if (!encoder) {
      throw new UnsupportedFormatError(`Decoding is not supported for data: ${JSON.stringify(data)}.
Make sure you have defined a decoder for this data type.`);
    }

    const decodedData = await encoder.decode(data);
    const normalizer = this.normalizers.find(denormalizer =>
      denormalizer.supportsDenormalization === undefined ? true : denormalizer.supportsDenormalization(decodedData));

    if (!normalizer) {
      throw new UnsupportedFormatError(`Denormalization is not supported for data: ${JSON.stringify(decodedData)}.
Make sure you have defined a denormalizer for this data type.`);
    }

    return normalizer.denormalize(decodedData);
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


