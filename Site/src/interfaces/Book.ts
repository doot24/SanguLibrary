export interface IBook {
    bookid : string,
    title : string,
    subTitle : string,
    authors : string[],
    editors : string[],
    description : string,
    category : string,
    isbn : string,
    cover : string,
    publication : string,
    publicationLocation : string,
    publicationYear : string,
    resume : string,
    remark : string,
    saveCipher : string
}

export class Book implements IBook {
    bookid : string = ""
    title : string = ""
    subTitle : string = ""
    authors : string[] = []
    editors : string[] = []
    description : string = ""
    category : string = ""
    isbn : string = ""
    publication : string = ""
    publicationLocation: string = ""
    publicationYear : string = ""
    cover : string = ""
    url : string = ""
    resume: string = ""
    remark: string = ""
    saveCipher: string = ""
}