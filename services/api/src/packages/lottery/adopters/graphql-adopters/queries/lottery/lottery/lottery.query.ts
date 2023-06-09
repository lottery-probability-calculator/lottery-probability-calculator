import { builder } from "@lpc/gql/builder";
import { Lottery } from "../../../object-types/lottery.type";
import { container } from "tsyringe";
import { GetLotteryQuery } from "@lpc/packages/lotterylottery/usecases/queries/lottery/get-lottery/query";
import { GetLotteryQueryInputSchema } from "@lpc/packages/lotterylottery/usecases/queries/lottery/get-lottery/input";
import { Base64 } from "src/libs/base64";

export const LotteryInput = builder.inputType("LotteryInput", {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});

builder.queryField("Lottery", (t) =>
  t.field({
    type: Lottery,
    args: {
      id: t.arg.id({ required: true }),
    },
    nullable: true,
    resolve: async (parent, args, context: unknown) => {
      const id = Number(Base64.decode(args.id.toString()).split(":")[1]);
      const input = GetLotteryQueryInputSchema.parse({ id });

      const query = container.resolve(GetLotteryQuery);

      const result = await query.execute(input);

      return {
        ...result.lottery,
        id: Base64.encode(`Lottery:${result.lottery.id}`),
      };
    },
  })
);
