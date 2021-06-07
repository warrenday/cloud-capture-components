declare module 'byte-size' {
  export default function byteSize(bytes: number): { toString: () => string };
}
