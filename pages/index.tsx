import { Heading } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NavBar from "@/components/NavBar";
import WordleGrid from "@/components/Grid";
import Keyboard from "@/components/Keyboard";


export default function Wordle() {

  return (
    <>
      <NavBar
        title={<Heading>Wordle</Heading>}
        actions={[]}
        icon={<HamburgerIcon />}
      />
      <WordleGrid numRows={6} numCols={6} />
      <Keyboard />
    </>
  )
}
