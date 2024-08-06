import {describe, expect, test} from 'vitest';
import {
  defineSerializer,
  defineNormalizer,
  defineEncoder
} from '../index';
import {format} from 'date-fns';

/**
 * Format after from submit and validation
 */
type TimeTrackValidatedFormType = {
  date: Date;
  startTime: string;
  endTime: string;
};

/**
 * Format to transport data to server
 */
type TimeTrackTDOType = {
  start: string;
  end: string;
};

/**
 * Format expected by server api endpoint request body
 */
type TimeTrackType = {
  start: Date;
  end: Date;
};

describe('Serializer tests', () => {
  const timeTrackNormalizer = defineNormalizer<TimeTrackValidatedFormType, TimeTrackTDOType>({
    denormalize(data: TimeTrackTDOType): TimeTrackValidatedFormType {
      return {
        date: new Date(data.start),
        startTime: format(data.start, 'kk:mm'),
        endTime: format(data.end, 'kk:mm'),
      };
    },
    normalize(data: TimeTrackValidatedFormType): TimeTrackTDOType {
      // Append date with start time
      const start = new Date(data.date);
      start.setUTCHours(Number(data.startTime.split(':')[0]));
      start.setUTCMinutes(Number(data.startTime.split(':')[1]));

      // Append date with end time
      const end = new Date(data.date.toISOString());
      end.setUTCHours(Number(data.endTime.split(':')[0]));
      end.setUTCMinutes(Number(data.endTime.split(':')[1]));

      return {
        start: start.toISOString(),
        end: end.toISOString()
      };
    }
  });
  const timeTrackEncoder = defineEncoder<TimeTrackTDOType, TimeTrackType>({
    async decode(data: TimeTrackType): Promise<TimeTrackTDOType> {
      return {
        start: data.start.toISOString(),
        end: data.end.toISOString()
      };
    },
    async encode(data: TimeTrackTDOType): Promise<TimeTrackType> {
      return {
        start: new Date(data.start),
        end: new Date(data.end)
      };
    }
  });
  const timeTrackSerializer = defineSerializer<TimeTrackValidatedFormType, TimeTrackTDOType, TimeTrackType>(
    timeTrackNormalizer, timeTrackEncoder
  );

  test('Should normalize correctly', async () => {
    const timeTrack = timeTrackNormalizer.normalize({
      date: new Date('2000-01-01T00:00:00.000Z'),
      startTime: '10:00',
      endTime: '12:00'
    });

    expect(timeTrack).toStrictEqual({
      start: '2000-01-01T10:00:00.000Z',
      end: '2000-01-01T12:00:00.000Z',
    });
  });

  test('Should denormalize correctly', async () => {
    const timeTrack = timeTrackNormalizer.denormalize({
      start: '2000-01-01T10:00:00.000Z',
      end: '2000-01-01T12:00:00.000Z',
    });

    expect(timeTrack).toStrictEqual({
      date: new Date('2000-01-01T10:00:00.000Z'),
        startTime: '10:00',
        endTime: '12:00'
    });
  });

  test('Should encode correctly', async () => {
    const timeTrack = await timeTrackEncoder.encode({
      start: '2000-01-01T10:00:00.000Z',
      end: '2000-01-01T12:00:00.000Z',
    });

    expect(timeTrack).toStrictEqual({
      start: new Date('2000-01-01T10:00:00.000Z'),
      end: new Date('2000-01-01T12:00:00.000Z'),
    });
  });

  test('Should decode correctly', async () => {
    const timeTrack = await timeTrackEncoder.decode({
      start: new Date('2000-01-01T10:00:00.000Z'),
      end: new Date('2000-01-01T12:00:00.000Z'),
    });

    expect(timeTrack).toStrictEqual({
      start: '2000-01-01T10:00:00.000Z',
      end: '2000-01-01T12:00:00.000Z',
    });
  });

  test('Should serialize correctly', async () => {
    const timeTrack = await timeTrackSerializer.serialize({
      date: new Date('2000-01-01T00:00:00.000Z'),
      startTime: '10:00',
      endTime: '12:00'
    });

    expect(timeTrack).toStrictEqual({
      start: new Date('2000-01-01T10:00:00.000Z'),
      end: new Date('2000-01-01T12:00:00.000Z'),
    });
  });

  test('Should deserialize correctly', async () => {
    const timeTrack = await timeTrackSerializer.deserialize({
      start: new Date('2000-01-01T10:00:00.000Z'),
      end: new Date('2000-01-01T12:00:00.000Z'),
    });

    expect(timeTrack).toStrictEqual({
      date: new Date('2000-01-01T10:00:00.000Z'),
      startTime: '10:00',
      endTime: '12:00'
    });
  });
});
