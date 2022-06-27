import type { DeepPartial, Theme } from "@chakra-ui/react";

/** extend additional color here */
const extendedColors: DeepPartial<Record<
  string,
  Theme["colors"]["blackAlpha"]
>> = {
  brand: {
    100: "#F79519",
    200: "#F79519",
    300: "#F79519",
    400: "#F79519",
    500: "#F79519",
    600: "#F79519",
    700: "#F79519",
    800: "#F79519",
    900: "#F79519",
  },
};

/** override chakra colors here */
const overridenChakraColors: DeepPartial<Theme["colors"]> = {};

const colors = {
  ...overridenChakraColors,
  ...extendedColors,
};

export default colors;
