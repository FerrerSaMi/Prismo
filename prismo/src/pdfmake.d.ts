declare module 'pdfmake/build/pdfmake.js' {
  const pdfMake: { addVirtualFileSystem(files: Record<string, string>): void; addFontContainer(container: unknown): void; addFonts(fonts: Record<string, unknown>): void; createPdf(definition: Record<string, unknown>): { getBlob(): Promise<Blob> } }
  export default pdfMake
}
declare module 'pdfmake/build/vfs_fonts.js' {
  const fonts: Record<string, string>
  export default fonts
}
declare module 'pdfmake/build/standard-fonts/*.js' {
  const container: unknown
  export default container
}
