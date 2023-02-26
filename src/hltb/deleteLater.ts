import { HLTBService } from "./service";
// import { HLTBUsers } from "./usersHttp";

let hltb = new HLTBService();

export const Test2 = async (): Promise<void>=>  {
    //can include abort signal
    let result = await hltb.getUserLists(["backlog"]);
    console.log(result);
    return;
}

Test2();

