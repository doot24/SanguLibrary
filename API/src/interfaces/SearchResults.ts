export {SearchResults}

class SearchResults
{
  books : SearchEntry = new SearchEntry();
  riders : SearchEntry  = new SearchEntry();
  journals : SearchEntry  = new SearchEntry();
  dissertations : SearchEntry  = new SearchEntry();
}

class SearchEntry 
{
  data : any[] = []
  amount : number = 0;
}