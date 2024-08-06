import {
  type SerializerInterface,
  type EncodeInterface,
  type DecodeInterface,
  type NormalizeInterface,
  type DenormalizeInterface
} from './types';

export function defineSerializer<LeftType, DTOType, RightType>(
  normalizer: NormalizeInterface<LeftType, DTOType> & DenormalizeInterface<LeftType, DTOType>,
  encoder: EncodeInterface<DTOType, RightType> & DecodeInterface<DTOType, RightType>
): Serializer<LeftType, DTOType, RightType> {
  return new Serializer<LeftType, DTOType, RightType>(normalizer, encoder);
}

export function defineNormalizer<LeftType, DTOType>(
  normalizer: NormalizeInterface<LeftType, DTOType> & DenormalizeInterface<LeftType, DTOType>
): NormalizeInterface<LeftType, DTOType> & DenormalizeInterface<LeftType, DTOType> {
  return normalizer;
}

export function defineEncoder<DTOType, RightType>(
  encoder: EncodeInterface<DTOType, RightType> & DecodeInterface<DTOType, RightType>
): EncodeInterface<DTOType, RightType> & DecodeInterface<DTOType, RightType> {
  return encoder;
}

export class Serializer<LeftType, DTOType, RightType> implements SerializerInterface<LeftType, RightType>,
  NormalizeInterface<LeftType, DTOType>,
  DenormalizeInterface<LeftType, DTOType>,
  EncodeInterface<DTOType, RightType>,
  DecodeInterface<DTOType, RightType> {
  constructor(
    private normalizer: NormalizeInterface<LeftType, DTOType> & DenormalizeInterface<LeftType, DTOType>,
    private encoder: EncodeInterface<DTOType, RightType> & DecodeInterface<DTOType, RightType>
  ) {
  }

  /**
   * Serialize data into RightType format.
   */
  serialize(data: LeftType): RightType {
    return this.encode(this.normalize(data));
  }

  /**
   * Deserialize data into LeftType format.
   */
  deserialize(data: RightType): LeftType {
    return this.denormalize(this.decode(data));
  }

  /**
   * Normalize data into DTO format.
   */
  normalize(data: LeftType): DTOType {
    return this.normalizer.normalize(data);
  }

  /**
   * Denormalize data into LeftType format.
   */
  denormalize(data: DTOType): LeftType {
    return this.normalizer.denormalize(data);
  }

  /**
   * Encode data into RightType format.
   */
  encode(data: DTOType): RightType {
    return this.encoder.encode(data);
  }

  /**
   * Decode data into DTOType format.
   */
  decode(data: RightType): DTOType {
    return this.encoder.decode(data);
  }
}
