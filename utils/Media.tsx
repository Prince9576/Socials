import { createMedia } from "@artsy/fresnel"

const AppMedia = createMedia({
    breakpoints: {
      zero: 0,
      mobile: 480,
      tab: 768,
      dekstop: 1080,
    },
  })
  
  export const { Media, MediaContextProvider, createMediaStyle } = AppMedia