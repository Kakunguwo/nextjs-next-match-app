import { auth, signOut } from "@/auth";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/avatar";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaEye, FaRegSmile } from "react-icons/fa";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-sm ">User Session Data: </h1>
      <div>
        {session ? 
        (
          <pre>{JSON.stringify(session, null , 2)}</pre>
        ): <h1>You are not logged in</h1>}
        <form action={async () => {
          'use server';

          await signOut();
        }}>
          <Button
            type="submit"
            color="primary"
            variant="bordered"
            startContent={<FaRegSmile size={20}/>}
          >
            Logout!
          </Button>
        </form>
      </div>
      
    </div>
  );
}
