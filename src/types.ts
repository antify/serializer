export interface SerializerInterface<LeftType, RightType> {
  serialize(data: LeftType): RightType | Promise<RightType>

  deserialize(data: RightType): LeftType | Promise<LeftType>
}

export interface EncoderInterface<DTOType, RightType> {
  /**
   * Encodes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  encode(data: DTOType): RightType | Promise<RightType>
}

export interface DecoderInterface<DTOType, RightType> {
  /**
   * Decodes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  decode(data: RightType): DTOType | Promise<DTOType>
}

export interface NormalizerInterface<LeftType, DTOType> {
  /**
   * Normalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  normalize(data: LeftType): DTOType | Promise<DTOType>
}

export interface DenormalizerInterface<LeftType, DTOType> {
  /**
   * Denormalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  denormalize(data: DTOType): LeftType | Promise<LeftType>
}

export class UnexpectedValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedValueError';
  }
}
