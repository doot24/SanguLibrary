interface IResourseInfo
{
  kind : Number
}

class BookAddResource implements IResourseInfo {
  title : string = "";
  kind: Number = 0;
  digital : boolean = false;
  subTitle: string = "";
  authors: string[] = [];
  editors: string[] = [];
  description: string = "";
  category: string = "";
  isbn: string = "";
  publication: string = "";
  publicationLocation: string = "";
  publicationYear: string = "";
  resume: string = "";
  remark: string = "";
  saveCipher: string = "";
  amount : number = 0;
}

class BookUpdateResource implements IResourseInfo {
  title : string = "";
  kind: Number = 0;
  subTitle: string = "";
  authors: string[] = [];
  editors: string[] = [];
  description: string = "";
  category: string = "";
  isbn: string = "";
  publication: string = "";
  publicationLocation: string = "";
  publicationYear: string = "";
  resume: string = "";
  remark: string = "";
  saveCipher: string = "";
  amount : number = 0;
}

export {IResourseInfo, BookAddResource, BookUpdateResource }