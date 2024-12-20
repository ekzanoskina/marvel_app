import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/spinner";

class CharList extends Component {
  state = {
    charList: [],
    loading: false,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading(); // на этапе первичной загрузки никак не повлияет, зато потом поможет внопку сделать disabled когда новые персонажи будут грузиться
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList], // складываем два массива в один (новые и старые персонажи)
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  
  itemRefs = [];

  setRef = (id) => {
    this.itemRefs.push(id)
  }

  focusOnItem = (i) => {
    this.itemRefs.forEach(item => {
      item.classList.remove('char__item_selected')
    })
    this.itemRefs[i].classList.add('char__item_selected');
    this.itemRefs[i].focus(); 
  }


  renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }
      return (
        <li
          className="char__item"
          tabIndex={0}                  
          key={item.id}
          ref={this.setRef}
          onClick={() => {this.props.onCharSelected(item.id); this.focusOnItem(i);}}
          onKeyPress={(e) => {
            if (e.key === ' ' || e.key === "Enter") {
                this.props.onCharSelected(item.id);
                this.focusOnItem(i);
            }}}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const items = this.renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{ display: charEnded ? "none" : "block" }}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
