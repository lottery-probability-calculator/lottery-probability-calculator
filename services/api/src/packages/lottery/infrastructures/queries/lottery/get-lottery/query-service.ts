import { GetLotteryDto } from "@lpc/packages/lotterylottery/domains/queries/lottery/get-lottery/dto";
import { GetLotteryQueryServiceInterface } from "@lpc/packages/lotterylottery/domains/queries/lottery/get-lottery/query-service.interface";
import { eq } from "drizzle-orm";
import { getPlanetScaleClient } from "@lpc/db/planet-scale/client";
import { lotterySchema } from "@lpc/db/planet-scale/schema/lottery.schema";
import { injectable } from "tsyringe";

@injectable()
export class GetLotteryQueryService implements GetLotteryQueryServiceInterface {
  async query(id: number): Promise<GetLotteryDto> {
    const client = await getPlanetScaleClient();
    const lotteries = await client
      .select()
      .from(lotterySchema)
      .where(eq(lotterySchema.id, id));

    if (lotteries.length < 1) {
      throw new Error(`Lottery is not found! (id=${id})`);
    }

    return {
      lottery: {
        id: lotteries[0].id,
        title: lotteries[0].title,
        beginDate: lotteries[0].beginAt,
        endDate: lotteries[0].endAt,
      },
    };
  }
}
