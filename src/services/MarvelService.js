class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=5854203285e89c0721ebd2c4326e65e3";
  _baseOffset = 210;

  getReasource = async (url) => {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getReasource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}` //650
    );
    return res.data.results.map(this._transformCharacter);
  };
  getCharacter = async (id) => {
    const res = await this.getReasource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: this.transformDescription(char.description),
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
  transformDescription = (desc) => {
    if (desc.length === 0) {
      return "There is no description for this character";
    } else if (desc.length >= 170) {
      return `${desc.slice(0, 170)}...`;
    } else {
      return desc;
    }
  };
}

export default MarvelService;
