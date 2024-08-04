export interface SerializerInterface<LeftType, RightType> {
  serialize(data: LeftType): Promise<RightType>

  deserialize(data: RightType): Promise<LeftType>
}

export interface EncoderInterface<DTOType, RightType> {
  /**
   * Encodes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  encode(data: DTOType): Promise<RightType>

  /**
   * Checks whether the serializer can encode to given format.
   *
   * If this function is not implemented, it will return true by default.
   */
  supportsEncoding?(data: unknown): boolean
}

export interface DecoderInterface<DTOType, RightType> {
  /**
   * Decodes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  decode(data: RightType): Promise<DTOType>

  /**
   * Checks whether the serializer can encode to given format.
   *
   * If this function is not implemented, it will return true by default.
   */
  supportsDecoding?(data: unknown): boolean
}

export interface NormalizerInterface<LeftType, DTOType> {
  /**
   * Normalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  normalize(data: LeftType): Promise<DTOType>

  /**
   * Checks whether the serializer can normalize to given format.
   *
   * If this function is not implemented, it will return true by default.
   */
  supportsNormalization?(data: unknown): boolean
}

export interface DenormalizerInterface<LeftType, DTOType> {
  /**
   * Denormalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  denormalize(data: DTOType): Promise<LeftType>

  /**
   * Checks whether the serializer can denormalize to given format.
   *
   * If this function is not implemented, it will return true by default.
   */
  supportsDenormalization?(data: unknown): boolean
}

export class UnexpectedValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedValueError';
  }
}

export class UnsupportedFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedFormatError';
  }
}
