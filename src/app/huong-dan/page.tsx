import Link from "next/link";
import { ClockIcon, MapIcon, SparkIcon, TrophyIcon, UsersIcon } from "@/components/icons";

const rules = [
  {
    icon: MapIcon,
    title: "Chọn địa bàn",
    text: "Đến lượt, đội chọn một địa bàn còn trống trong ba chương lịch sử.",
  },
  {
    icon: ClockIcon,
    title: "Trả lời trong 15 giây",
    text: "Đội nói A, B, C hoặc D. Host nhập lựa chọn và hệ thống tự chấm.",
  },
  {
    icon: UsersIcon,
    title: "Cướp quyền",
    text: "Nếu đội chính sai hoặc hết giờ, hai đội khác có thể lần lượt cướp 60 rồi 40 điểm.",
  },
  {
    icon: TrophyIcon,
    title: "Hoàn thành hành trình",
    text: "Sở hữu ít nhất một địa bàn ở cả ba chương để nhận thêm 50 điểm.",
  },
];

export default function GuidePage() {
  return (
    <main className="flex h-screen items-center overflow-hidden px-[var(--page-gutter)] py-4">
      <div className="mx-auto grid h-full max-h-[960px] w-full max-w-[1560px] grid-cols-[1fr_340px] gap-6">
        <section className="game-panel flex min-h-0 flex-col rounded-[32px] p-7 2xl:p-10">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-terracotta">Hướng dẫn nhanh cho người chơi</p>
              <h1 className="display mt-2 text-[clamp(3rem,5vw,5.5rem)] leading-none text-ink">Làm chủ thời cơ</h1>
            </div>
            <p className="max-w-md text-right text-lg font-medium leading-7 text-ink-soft">Chiếm địa bàn, kết nối ba giai đoạn lịch sử và ghi điểm bằng kiến thức.</p>
          </div>

          <div className="mt-7 grid min-h-0 flex-1 grid-cols-2 gap-4">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <article key={rule.title} className="rounded-[24px] border-2 border-line bg-paper-soft p-5 2xl:p-7">
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-terracotta-soft text-terracotta-dark"><Icon className="size-6" /></span>
                    <div>
                      <p className="text-sm font-black text-terracotta">0{index + 1}</p>
                      <h2 className="text-xl font-extrabold text-ink 2xl:text-2xl">{rule.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-base font-medium leading-7 text-ink-soft 2xl:text-lg">{rule.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-3">
          <div className="rounded-[24px] bg-ink p-5 text-white shadow-xl">
            <div className="flex items-center gap-3"><SparkIcon className="size-6 text-amber" /><h2 className="text-xl font-extrabold">Chớp thời cơ</h2></div>
            <p className="mt-2 text-sm leading-6 text-white/72">Mỗi đội được dùng một lần trước khi chọn địa bàn. Hiệu ứng nhận được là ngẫu nhiên: loại một đáp án sai, thêm 10 giây hoặc thưởng 50 điểm nếu trả lời đúng.</p>
          </div>

          <div className="min-h-0 rounded-[24px] border-2 border-line-strong bg-paper p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-terracotta">Ba mốc cao trào</p>
            <h2 className="display mt-1 text-2xl text-ink">Biến cố lịch sử</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">Sau câu 6, 12 và 18, tất cả đội có 45 giây tham khảo cho một thử thách chung. Đồng hồ về 0 không tự đóng lượt; host chủ động chốt hoặc bỏ qua.</p>
            <div className="mt-3 space-y-2 text-sm font-bold text-ink">
              <p className="rounded-xl bg-terracotta-soft px-4 py-2.5">06 · Sắp xếp trình tự</p>
              <p className="rounded-xl bg-sage-soft px-4 py-2.5">12 · Ghép sự kiện</p>
              <p className="rounded-xl bg-amber-soft px-4 py-2.5">18 · Chọn nguyên tắc</p>
            </div>
          </div>

          <Link href="/" className="flex min-h-14 items-center justify-center rounded-2xl bg-terracotta px-5 text-lg font-extrabold text-white transition hover:bg-terracotta-dark">Về thiết lập trận đấu</Link>
        </aside>
      </div>
    </main>
  );
}
