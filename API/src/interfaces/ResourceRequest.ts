class BookAddResource {
  title : string = "";
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

class BookUpdateResource {
  title : string = "";
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

class JournalAddResource {
  title : string = "";
  digital : boolean = false;
  subTitle: string = "";
  authors: string[] = [];
  editors: string[] = [];
  collegues : string[] = [];
  description: string = "";
  category: string = "";
  number : number = 0;
  issn: string = "";
  publication: string = "";
  publicationLocation: string = "";
  publicationYear: string = "";
  resume: string = "";
  remark: string = "";
  saveCipher: string = "";
  amount : number = 0;
}

class JournalUpdateResource {
  title : string = "";
  subTitle: string = "";
  authors: string[] = [];
  editors: string[] = [];
  collegues : string[] = [];
  description: string = "";
  category: string = "";
  number : number = 0;
  issn: string = "";
  publication: string = "";
  publicationLocation: string = "";
  publicationYear: string = "";
  resume: string = "";
  remark: string = "";
  saveCipher: string = "";
  amount : number = 0;
}

export { BookAddResource, BookUpdateResource, JournalAddResource, JournalUpdateResource }