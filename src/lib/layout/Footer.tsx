import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center">
      <Text>
        {new Date().getFullYear()} -{" "}
        <Link href="/" isExternal rel="noopener noreferrer">
          shine.network
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
