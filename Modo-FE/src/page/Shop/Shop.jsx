import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Shop.module.css";
import TopBar from "../../components/TopBar/TopBar";
import goldIcon from "../../assets/icon/gold.png";
import minusIcon from "../../assets/icon/Minus.svg";
import addIcon from "../../assets/icon/Add.svg";

export default function Shop() {
  const navigate = useNavigate();
  const [gold] = useState(100); 
  const [quantities, setQuantities] = useState({
    gold10: 0,
    gold100: 0,
    gold1000: 0,
    character: 0,
    pause: 0,
  });

  const handleBack = () => {
    navigate("/map");
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] + delta),
    }));
  };

  const handlePurchase = () => {
    // 구매 로직 구현
    console.log("구매하기", quantities);
  };

  const items = [
    {
      id: "gold10",
      title: "10골드",
      description: "현금을 이용해 골드를 구매합니다.",
      price: "400원",
      priceType: "cash",
    },
    {
      id: "gold100",
      title: "100골드",
      description: "현금을 이용해 골드를 구매합니다.",
      price: "2,500원",
      priceType: "cash",
    },
    {
      id: "gold1000",
      title: "1000골드",
      description: "현금을 이용해 골드를 구매합니다.",
      price: "5,000원",
      priceType: "cash",
    },
    {
      id: "character",
      title: "캐릭터 선택권",
      description: "다른 유형을 선택할 수 있습니다.",
      price: "100골드",
      priceType: "gold",
    },
    {
      id: "pause",
      title: "일시정지권",
      description: "딱 하루, 할 일을 멈출 수 있습니다.",
      price: "350골드",
      priceType: "gold",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TopBar
          title="상점"
          onBack={handleBack}
          showSkip={false}
          textColor="dark"
        />
      </div>
      
      <div className={styles.goldInfo}>
        <img src={goldIcon} alt="골드" className={styles.goldIcon} />
        <span className={styles.goldText}>보유한 골드: {gold}</span>
      </div>

      <div className={styles.content}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.leftSection}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, -1)}
                  disabled={quantities[item.id] === 0}
                >
                  <img src={minusIcon} alt="감소" className={styles.quantityIcon} />
                </button>
                <span className={styles.quantity}>{quantities[item.id]}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(item.id, 1)}
                >
                  <img src={addIcon} alt="증가" className={styles.quantityIcon} />
                </button>
              </div>
            </div>
            <span className={styles.itemPrice}>{item.price}</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.purchaseButton} onClick={handlePurchase}>
          구매하기
        </button>
      </div>
    </div>
  );
}

