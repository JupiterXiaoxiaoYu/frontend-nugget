import React, { useEffect, useRef, useState } from "react";
import "./Nugget.css";
import self_own_tag from "../../../images/scene/gameplay/nugget/tag_frame.png";
import {
  getAttributeList,
  getNuggetImage,
  getTextShadowStyle,
} from "../../common/Utility";
import DefaultButton from "../../buttons/DefaultButton";
import NuggetLevel from "./NuggetLevel";
import { NuggetData } from "../../../../data/model";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { useAppSelector } from "../../../../app/hooks";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";

interface Props {
  nuggetData: NuggetData;
  onClickMore: () => void;
  showBidPrice: boolean;
  showTag: boolean;
}

const attributeLefts = [
  0.02, 0.058, 0.096, 0.134, 0.17, 0.205, 0.242, 0.28, 0.318, 0.356, 0.394,
  0.43, 0.465, 0.503, 0.54, 0.578, 0.615, 0.652, 0.69, 0.728, 0.765, 0.803,
  0.84, 0.878, 0.914, 0.951,
];

const Nugget = ({ nuggetData, onClickMore, showBidPrice, showTag }: Props) => {
  const { l2Account } = useWalletContext();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const [tagFontSize, setTagFontSize] = useState<number>(0);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetLevel = 7 - nuggetData.feature;
  const nuggetBidPrice = nuggetData.bid?.bidprice ?? 0;
  const nuggetAskPrice = nuggetData.askprice;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );
  const pids = l2Account?.pubkey
    ? new LeHexBN(bnToHexLe(l2Account?.pubkey)).toU64Array()
    : ["", "", "", ""];
  const selfOwned =
    nuggetData.owner[0] == Number(pids[1]) &&
    nuggetData.owner[1] == Number(pids[2]);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 11);
      setDescriptionFontSize(containerRef.current.offsetHeight / 13);
      setAttributesFontSize(containerRef.current.offsetHeight / 10);
      setTagFontSize(containerRef.current.offsetHeight / 13);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div ref={containerRef} className="nugget-container">
      <img className="nugget-avatar-image" src={getNuggetImage(nuggetLevel)} />
      <div className="nugget-margin-container">
        <p
          className="nugget-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`Nugget ID: ${nuggetId}`}
        </p>
        <div className="nugget-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="nugget-level-container">
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <p
          className="nugget-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          Recycle Price:
        </p>
        <p
          className="nugget-price-value-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {nuggetPrice}
        </p>
        {showBidPrice && (
          <>
            <p
              className="nugget-bid-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              Bid Price:
            </p>
            <p
              className="nugget-bid-value-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              {nuggetBidPrice}
            </p>
            <p
              className="nugget-ask-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              Buyout Price:
            </p>
            <p
              className="nugget-ask-value-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              {nuggetAskPrice}
            </p>
          </>
        )}
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              className="nugget-attributes-text"
              key={index}
              style={{
                left: `${attributeLefts[index] * 100}%`,
                fontSize: attributesFontSize,
                ...getTextShadowStyle(attributesFontSize / 15),
              }}
            >
              {s}
            </p>
          ))}
        </div>
        <div className="nugget-more-button">
          <DefaultButton
            text={"More"}
            onClick={onClickMore}
            isDisabled={false}
            fontSizeRatio={1.2}
          />
        </div>
        {showTag && selfOwned && (
          <div className="nugget-tag-container">
            <img className="nugget-tag-image" src={self_own_tag} />
            <p
              className="nugget-tag-text"
              style={{
                fontSize: tagFontSize,
                ...getTextShadowStyle(tagFontSize / 15),
              }}
            >
              List by you
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nugget;
