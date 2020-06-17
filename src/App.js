import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { photos } from "./photos";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";
import logo from "./25years.png";

const Button = ({ css, ...props }) => (
  <div
    style={{
      alignItems: "center",
      color: "#f27523",
      cursor: "pointer",
      display: "flex ",
      fontWeight: 300,
      height: 42,
      justifyContent: "center",
      marginLeft: 10,
      position: "relative",
      textAlign: "center",
      minWidth: 42,

      "&:hover, &:active": {
        color: "peru"
      },

      ...css
    }}
    role="button"
    {...props}
  />
);

type SvgProps = { size: number };

const Svg = ({ size, ...props }: SvgProps) => (
  <svg
    role="presentation"
    viewBox="0 0 24 24"
    style={{
      display: "inline-block",
      fill: "currentColor",
      height: size,
      stroke: "currentColor",
      strokeWidth: 0,
      width: size
    }}
    {...props}
  />
);

export const Close = ({ size = 34, ...props }: SvgProps) => (
  <Svg size={size} {...props}>
    <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z" />
  </Svg>
);
export const Heart = ({ size = 34, ...props }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0"
    y="0"
    enableBackground="new 0 0 512 512"
    version="1.1"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
    fill="#f27523"
    height="24"
    width="24"
  >
    <path d="M382.56 233.376A15.96 15.96 0 00368 224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832 0-16 7.168-16 16v208h-64a16.013 16.013 0 00-14.56 9.376c-2.624 5.728-1.6 12.416 2.528 17.152l112 128A15.946 15.946 0 00256 384c4.608 0 8.992-2.016 12.032-5.472l112-128c4.16-4.704 5.12-11.424 2.528-17.152z"></path>
    <path d="M432 352v96H80v-96H16v128c0 17.696 14.336 32 32 32h416c17.696 0 32-14.304 32-32V352h-64z"></path>
  </svg>
);

/* const CustomHeader = ({ innerProps, isModal }) =>
  isModal ? (
    <div {...innerProps}>
      <div>fxcruzt</div>
    </div>
  ) : null; */

export const CustomHeader = ({ currentView, modalProps }) => {
  console.log("currentView", currentView, modalProps);
  const { onClose } = modalProps;

  return (
    <div
      id="fxcruzt"
      style={{
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.1",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
        color: "white",
        display: "flex ",
        flex: "0 0 auto",
        height: "55px",
        justifyContent: "space-between",
        position: "fixed",
        top: "0px",
        right: "60px",
        zIndex: "9999999999999999"
      }}
    >
      <div
        style={{ alignItems: "center", display: "flex ", minWidth: 0 }}
      ></div>
      <div style={{ alignItems: "center", display: "flex " }}>
        <a
          href={currentView.source.download}
          style={{ display: "block", border: "1 px solid white" }}
        >
          <Heart />
        </a>
        <Button
          onClick={onClose}
          css={{
            paddingLeft: 10
          }}
        >
          <Close />
        </Button>
      </div>
    </div>
  );
};

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [count, setCount] = useState(40);
  const [items, setItems] = useState(photos.slice(0, count));
  const [hasMore, setHasMore] = useState(true);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    if (items.length >= 271) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems(items.concat(photos.slice(count, count + 5)));
    }, 1000);
    setCount(count + 5);
    console.log("count", count);
  };

  console.log("items", items);
  console.log("photos tamaño", photos.length);

  return (
    <React.Fragment>
      <div
        style={{
          height: "200px",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <img
          src={logo}
          alt="logo 25 aniversario"
          style={{ widht: "100%", maxWidth: "200px" }}
        />
      </div>
      <div>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Todos las fotos fueron cargadas.</b>
            </p>
          }
        >
          <Gallery photos={items} onClick={openLightbox} />

          <ModalGateway>
            {viewerIsOpen ? (
              <Modal onClose={closeLightbox}>
                <Carousel
                  currentIndex={currentImage}
                  components={{ Header: CustomHeader }}
                  views={photos.map(x => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: x.title,
                    source: {
                      download: x.download,
                      fullscreen: null,
                      regular: x.medium,
                      thumbnail: x.thumb
                    }
                  }))}
                />
              </Modal>
            ) : null}
          </ModalGateway>
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
}

export default App;
