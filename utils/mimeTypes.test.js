import { mimeType } from './mimeTypes';

describe('mimeType utils', () => {
  it('should return image/jpeg for .jpg', () => {
    const filePath = 'somefile.jpg';
    expect(mimeType(filePath)).toBe('image/jpeg');
  });
  it('should return image/jpeg for .jpeg', () => {
    const filePath = 'somefile.jpeg';
    expect(mimeType(filePath)).toBe('image/jpeg');
  });
  it('should return image/jpeg for .jpeg', () => {
    const filePath = 'somefile.jpeg';
    expect(mimeType(filePath)).toBe('image/jpeg');
  });
  it('should return corrent mime type for .docx', () => {
    const filePath = 'somefile.docx';
    expect(mimeType(filePath)).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  });
});
