import React from "react";
import { Image } from "react-native-elements";
import Carousel from "react-native-snap-carousel";

export default CarouselElement = (props) => {
  const { arrayImages, height, width } = props;

  const RenderItem = ({ item }) => {
    return <Image style={{ width, height }} source={{ uri: item }} />;
  };
  return (
    <Carousel
      layout={"default"}
      data={arrayImages}
      sliderWidth={width}
      itemWidth={width}
      renderItem={RenderItem}
    />
  );
};
