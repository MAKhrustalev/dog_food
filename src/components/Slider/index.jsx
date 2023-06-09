// создаем slider на bootstrap
import { useState, useContext, useEffect } from "react";
import { Row, Col, Carousel, Container } from "react-bootstrap";
import BsCard from "../BsCard";
import Ctx from "../../ctx";

import "./style.css";

const Slider = ({ desktop = 4, mobile = 1 }) => {
  const { baseData } = useContext(Ctx);
  const [gds, setGds] = useState([[]]);
  const [cnt, setCnt] = useState(desktop);
  // адаптация карусели под мобильные устройства
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setCnt(mobile);
    } else setCnt(desktop);
    // Max - В компоненте Slider вы навешиваете слушатель на window. В таких кейсах необходимо удалять слушатель при размонитровании компонента, иначе он будет работать все время и сохранятся ссылки на стейт и так далее.
    window.addEventListener("resize", function () {
      if (window.innerWidth <= 768) {
        setCnt(mobile);
      } else {
        setCnt(desktop);
      }
    });
  }, []);

  useEffect(() => {
    if (baseData.length) {
      /*
               // reduce
               setGds(baseGoods.reduce((acc, el, i) => {
                   if (i < 5) {
                   // if (acc.length < 5) {
                       acc.push(el)
                   }
                   return acc;
               }, []));
           */
      /*
           // filter
           setGds(baseData.filter((el, i) => i < 5));
           */
      // const itemArr = []
      // [
      //     [e, e, e, e]   4
      //     [e, e, e, e]      4
      //     [e, e, e]    4
      // ]

      // сколько разных карточек на слайдере
      setGds(
        baseData.reduce((acc, el, i) => {
          if (i % cnt === 0) {
            acc.push([]);
          }
          acc[acc.length - 1].push(el);
          return acc;
        }, [])
      );
    }
  }, [baseData, cnt]);

  useEffect(() => {}, [gds]);

  return (
    <Container style={{ gridTemplateColumns: "1fr" }}>
      <Carousel controls={false} interval={5000} indicators={false}>
        {gds.map((el, i) => (
          <Carousel.Item key={i}>
            <Row>
              {el.map((card) => (
                <Col xs={12 / cnt} key={card._id}>
                  <BsCard {...card} />
                </Col>
              ))}
              {/*<Col xs={3}><BsCard {...el} /></Col>*/}
              {/*<Col xs={3}><BsCard {...el} /></Col>*/}
              {/*<Col xs={3}><BsCard {...el} /></Col>*/}
              {/*<Col xs={3}><BsCard {...el} /></Col>*/}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default Slider;
