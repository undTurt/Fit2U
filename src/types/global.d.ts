declare namespace Intl {
  class Segmenter {
    constructor(locales?: string | string[], options?: SegmenterOptions);
    segment(input: string): IterableIterator<SegmentData>;
  }

  interface SegmenterOptions {
    granularity?: 'grapheme' | 'word' | 'sentence';
  }

  interface SegmentData {
    segment: string;
    index: number;
    isWordLike?: boolean;
  }
}