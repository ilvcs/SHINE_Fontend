import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center" justify='center'>
      <Text color='whiteAlpha.500'>
        {`@${new Date().getFullYear()}`} -{" "}
        <Link href="/" isExternal rel="noopener noreferrer">
          shinechain.co (Just kidding, there is no copyright 😜)
        </Link>
      </Text>
      
    </Flex>
  );
};

export default Footer;
