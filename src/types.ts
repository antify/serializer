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
}

export interface DecoderInterface<DTOType, RightType> {
  /**
   * Decodes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  decode(data: RightType): Promise<DTOType>
}

export interface NormalizerInterface<LeftType, DTOType> {
  /**
   * Normalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  normalize(data: LeftType): Promise<DTOType>
}

export interface DenormalizerInterface<LeftType, DTOType> {
  /**
   * Denormalizes data into the given format.
   *
   * @throws UnexpectedValueError
   */
  denormalize(data: DTOType): Promise<LeftType>
}

export class UnexpectedValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedValueError';
  }
}
