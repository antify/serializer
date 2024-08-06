export interface SerializerInterface<LeftType, RightType> {
  serialize(data: LeftType): RightType

  deserialize(data: RightType): LeftType
}

export interface EncodeInterface<DTOType, RightType> {
  /**
   * Encodes data into the given format.
   */
  encode(data: DTOType): RightType
}

export interface DecodeInterface<DTOType, RightType> {
  /**
   * Decodes data into the given format.
   */
  decode(data: RightType): DTOType
}

export interface NormalizeInterface<LeftType, DTOType> {
  /**
   * Normalizes data into the given format.
   */
  normalize(data: LeftType): DTOType
}

export interface DenormalizeInterface<LeftType, DTOType> {
  /**
   * Denormalizes data into the given format.
   */
  denormalize(data: DTOType): LeftType
}
