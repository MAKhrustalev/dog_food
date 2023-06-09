import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SuitHeart, SuitHeartFill } from "react-bootstrap-icons"; // иконки сердечек
import "./card.css";
import Ctx from "../../ctx";

// const Card = (props) => { Старая версия
//     return <div className="card-lite">
//         <img src={props.img} alt={props.name}/>
//         <h4>{props.price} ₽</h4>
//         <p>{props.name}</p>
//         <button>Купить</button>
//     </div>
// }

/*
    Для получения или установки товара как избранное (like), 
    надо проверить, есть ли в массиве likes моё id (_id => local storage => userDescId)
    Выбрать свойства, которые необходимо показывать на странице товара
*/
const Card = ({ discount, likes, name, pictures, price, tags, _id, user }) => {
  const { setBaseData, basket, setBasket } = useContext(Ctx);
  const [isLike, setIsLike] = useState(likes?.includes(user) || []);

  // товары в корзине
  const inBasket = basket.filter((el) => _id === el.id).length > 0; // "в корзине" для этого конкретного товара

  const likeHandler = () => {
    // обработчик лайка
    setIsLike(!isLike);
    setBaseData((old) =>
      old.map((el) => {
        // меняем в общем массиве с товарами только наш товар (на который кликнули)
        if (el._id === _id) {
          // Если у меня был лайк
          isLike
            ? // Я его удаляю (из массива убираю ненужное значение)
              (el.likes = el.likes.filter((lk) => lk !== user))
            : // Иначе, добавим лайк
              el.likes.push(user);
        }
        return el; // возвращаем измененый или неизменный элемент
      })
    );
  };
  // добавление корзины
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
  // id не должен начинаться с цифры (правило для css)
  return (
    <div className="card__lite" id={"pro_" + _id}>
      {likes && (
        <span className="card__like" onClick={likeHandler}>
          {isLike ? <SuitHeartFill /> : <SuitHeart />}
        </span>
      )}
      <img src={pictures} alt={name} />
      <h4>{price} ₽</h4>
      <p>{name}</p>
      <button disabled={inBasket} onClick={addToBasket}>
        Купить
      </button>
      <Link to={`/products/${_id}`} className="card__link"></Link>
    </div>
  );
};

export default Card;
