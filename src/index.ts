import {
  type SerializerInterface,
  type EncoderInterface,
  type DecoderInterface,
  type NormalizerInterface,
  type DenormalizerInterface
} from './types';

export function defineSerializer<LeftType, DTOType, RightType>(
  normalizer: NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>,
  encoder: EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>
): Serializer<LeftType, DTOType, RightType> {
  return new Serializer<LeftType, DTOType, RightType>(normalizer, encoder);
}

export class Serializer<LeftType, DTOType, RightType> implements SerializerInterface<LeftType, RightType>,
  NormalizerInterface<LeftType, DTOType>,
  DenormalizerInterface<LeftType, DTOType>,
  EncoderInterface<DTOType, RightType>,
  DecoderInterface<DTOType, RightType> {
  constructor(
    private normalizer: NormalizerInterface<LeftType, DTOType> & DenormalizerInterface<LeftType, DTOType>,
    private encoder: EncoderInterface<DTOType, RightType> & DecoderInterface<DTOType, RightType>
  ) {
  }

  /**
   * Serialize data into RightType format.
   */
  async serialize(data: LeftType): Promise<RightType> {
    return this.encode(await this.normalize(data));
  }

  /**
   * Deserialize data into LeftType format.
   */
  async deserialize(data: RightType): Promise<LeftType> {
    return this.denormalize(await this.decode(data));
  }

  /**
   * Normalize data into DTO format.
   */
  async normalize(data: LeftType): Promise<DTOType> {
    return this.normalizer.normalize(data);
  }

  /**
   * Denormalize data into LeftType format.
   */
  async denormalize(data: DTOType): Promise<LeftType> {
    return this.normalizer.denormalize(data);
  }

  /**
   * Encode data into RightType format.
   */
  async encode(data: DTOType): Promise<RightType> {
    return this.encoder.encode(data);
  }

  /**
   * Decode data into DTOType format.
   */
  async decode(data: RightType): Promise<DTOType> {
    return this.encoder.decode(data);
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


