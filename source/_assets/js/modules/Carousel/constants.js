// Constants for the Carousel Component

export const SEL_CAROUSEL = "[data-carousel=component]";
export const SEL_CAROUSEL_SLIDES_HOLDER = "[data-carousel=holder]";
export const SEL_CAROUSEL_SLIDE_CONTAINER = "[data-carousel=slides]";
export const SEL_CAROUSEL_SLIDE = "[data-carousel=slide]";
export const SEL_CAROUSEL_SLIDE_FIRST = "[data-carousel=slide]:first-child";
export const SEL_CAROUSEL_TABS_CONTAINER = "[data-carousel=tabs]";
export const SEL_CAROUSEL_TAB_LINK = "[data-carousel=tabLink]";
export const SEL_CAROUSEL_CONTROLS = "[data-carousel=controls]";
export const SEL_CAROUSEL_NEXT_LINK = "[data-carousel-target]";
export const SEL_CAROUSEL_INDEX = "[data-carousel=index]";
export const SEL_CAROUSEL_INDEX_ITEM = "[data-carousel=indexItem]";
export const SEL_CAROUSEL_SCROLLBAR = "[data-carousel=scrollbar]";

// Selectors for delegated events - need to include parent component to ensure specificity
export const EVENT_SEL_CAROUSEL_CONTROL = "[data-carousel=component] [data-action]";
export const EVENT_SEL_CAROUSEL_SLIDE = "[data-carousel=component] [data-carousel=slide]";
export const EVENT_SEL_CAROUSEL_INDEX_ITEM = "[data-carousel=component] [data-index]";

export const CLASS_SHOW_CONTROLS = "show_Controls";
