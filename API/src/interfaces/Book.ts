export interface IBook {
    bookid : String,
    title : String,
    subTitle : String,
    authors : Array<String>,
    editors : Array<String>,
    description : String,
    category : String,
    isbn : String,
    cover : String,
    publication : String,
    publicationLocation : String,
    publicationYear : String,
    resume : String,
    remark : String,
    saveCipher : String
}

export class DigitalBook implements IBook {
    bookid : String = ""
    title : String = ""
    subTitle : String = ""
    authors : Array<String> = []
    editors : Array<String> = []
    description : String = ""
    category : String = ""
    isbn : String = ""
    publication : String = ""
    publicationLocation: String = ""
    publicationYear : String = ""
    cover : String = ""
    url : String = ""
    resume: String = ""
    remark: String = ""
    saveCipher: String = ""
}