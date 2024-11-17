import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import "./charInfo.scss";
import thor from "../../resources/img/thor.jpeg";

class CharInfo extends Component {
  state = {
    char: null,
    loading: false, // спиннер сначала не нужен, так как при первой загрузке не загружаем данные с севера, а рендерим готовые
    error: false,
  };
  marvelService = new MarvelService();

  componentDidMount() {
    // this.updateChar(); // на всякий случай оставляем, хотя при первой загрузке странице этот элемент не загружается
  }
  componentDidUpdate(prevProps) {
    // принимает в качестве аргументов предыдущее состояние и пропсы
    // сама функция запускается, когда мы получили либо новые пропсы, либо новые стейты
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  componentDidCatch() {

  }

  updateChar = () => {
    const { charId } = this.props;
    if (!charId) {
      return;
    }
    this.onCharLoading();
    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
   
  };
  onCharLoaded = (char) => {
    this.setState({ char, loading: false, error: false });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharLoading = () => {
    this.setState({
      loading: true,
    });
  };

  render() {
    const { char, loading, error } = this.state;
    const skeleton = char || loading || error ? null : <Skeleton />; // если у нас что-то из этого есть, то мы возвращаем null, нет ничего - Скелетон
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;
    return (
      <div className="char__info">
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  let imgStyle = {'objectFit': 'cover'};
  if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = {'objectFit': 'contain'};
  }
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} style={imgStyle} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null: 'There are no comics with this character'}
        {comics.map((item, i) => {
            if (i > 9) return;
            return (
                <li key={i} className="char__comics-item">
                {item.name}
              </li>
            )
        })}


      </ul>
    </>
  );
};

export default CharInfo;
