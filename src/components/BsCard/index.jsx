import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons";
import { Card, Button } from "react-bootstrap"; // импорт компонентов под react-bootstrap
import Ctx from "../../ctx";

const BsCard = ({ discount, likes, name, pictures, price, tags, _id }) => {
  // TODO: Сердечки стоят не там, где должны на самом деле (при поиске и обновлении страницы)
  const { setBaseData, userId, api, basket, setBasket } = useContext(Ctx);
  const [isLike, setIsLike] = useState(likes.includes(userId));
  //  чтобы лайки сохранялись при перезагрузке страницы, для данного пользователя
  const [likeFlag, setLikeFlag] = useState(false);

  const likeHandler = (_id) => {
    setIsLike(!isLike);
    setLikeFlag(true);
  };
  useEffect(() => {
    if (likeFlag) {
      api.setLike(_id, isLike).then((data) => {
        // console.log(data.filter(el => el._id === _id));
        setLikeFlag(false);

        // setBaseData((old) => old.map(el => el._id === data._id ? data : el))
        api.getProducts().then((newData) => {
          setBaseData(newData.products);
        });
      });
    }
  }, [isLike, _id, api, likeFlag, setBaseData]); // deps '_id', 'api', 'likeFlag', 'setBaseData' добавил, тк прога ругалась
  // добавить в корзину
  const inBasket = basket.filter((el) => _id === el.id).length > 0;
  const addToBasket = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Нет проверки на то, что товар уже есть в корзине и нужно увеличить его кол-во, как на стр одного товара
    setBasket((prev) => [
      ...prev,
      {
        id: _id,
        price,
        discount,
        cnt: 1,
      },
    ]);
  };

  // Карточка на обычном bootstrap
  // return <div className="card pt-3" id={"pro_" + _id}>
  //     <span className="card-like" onClick={likeHandler}>
  //         {isLike ? <SuitHeartFill/> : <SuitHeart/>}
  //     </span>
  //     <img src={pictures} alt={name} className="card-img-top align-self-center w-auto" height="100"/>
  //     <div className="card-body d-flex flex-column">
  //         <h4>{price} ₽</h4>
  //         <p className="text-secondary fs-5 flex-grow-1">{name}</p>
  //         <button className="btn btn-warning w-100">Купить</button>
  //     </div>
  //     <Link to={`/product/${_id}`} className="card-link"></Link>
  // </div>
  // Карточка на обычном react-bootstrap
  return (
    <Card className="pt-3 h-100" id={"pro_" + _id}>
      {userId && (
        <span className="card__like" onClick={likeHandler}>
          {isLike ? <SuitHeartFill /> : <SuitHeart />}
        </span>
      )}
      <Card.Img
        variant="top"
        src={pictures}
        alt={name}
        className="align-self-center w-auto"
        height="100"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h4">{price} ₽</Card.Title>
        <Card.Text className="text-secondary fs-5 flex-grow-1">
          {name}
        </Card.Text>
        <Button
          disabled={inBasket}
          onClick={addToBasket}
          variant="warning"
          className="w-100 position-relative"
          style={{ zIndex: "1" }}
        >
          {inBasket ? "В корзине" : "Купить"}
        </Button>
      </Card.Body>
      <Link to={`/product/${_id}`} className="card__link"></Link>
    </Card>
  );
};

export default BsCard;
