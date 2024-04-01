export abstract class Upload {
    imageId?: string
    documentId?: string
    fieldName?: string
    originalName?: string
    encoding?: string
    mimetype?: string
    filename?: string
    path?: string
    size?: number
    createdBy?: string
    constructor(imageId?: string,
        documentId?: string,
        fieldName?: string,
        originalName?: string,
        encoding?: string,
        mimetype?: string,
        filename?: string,
        path?: string,
        size?: number,
        createdBy?: string,) {
        this.imageId = imageId,
            this.documentId = documentId,
            this.fieldName = fieldName,
            this.originalName = originalName,
            this.encoding = encoding,
            this.mimetype = mimetype,
            this.filename = filename,
            this.path = path,
            this.size = size,
            this.createdBy = createdBy
    }
}