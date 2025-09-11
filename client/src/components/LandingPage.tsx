import React from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import Link from "next/link";
const LandingPage = async () => {
  const images = [
    "https://www.chapter247.com/wp-content/uploads/2021/03/Design-best-practices-for-LMS-software-development-.jpg",
    "https://mintbook.com/blog/wp-content/uploads/SAAS-Learning-Management-System.jpg",
    "https://static.vecteezy.com/system/resources/previews/005/526/658/non_2x/close-up-of-businessman-hand-holding-to-lms-learning-management-system-web-icon-for-lesson-and-online-education-course-application-study-e-learning-knowledge-everywhere-and-every-time-photo.jpg",
    "https://tint.creativemarket.com/IBTkG0wxW_zuju_vFrrtOt1H-qOcfB6Lh_6J-f0EgHA/width:3005/height:2000/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzc1OS83NTk5Lzc1OTkzODAvcHJvZ3JhbW1pbmctbGluZS1hcnQtYmFubmVyLTAxLW8uanBn?1579167779",
    "https://thumbs.dreamstime.com/b/technology-concept-programming-web-banner-best-languages-process-software-development-126973987.jpg",
    "https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_640.jpg",
    "https://cdn.pixabay.com/photo/2014/10/05/19/02/binary-code-475664_640.jpg",
    "https://cdn.pixabay.com/photo/2017/08/10/08/47/laptop-2620118_640.jpg",
    "https://cdn.pixabay.com/photo/2023/09/06/18/10/ai-generated-8237711_640.jpg",
    "https://cdn.pixabay.com/photo/2015/09/09/21/12/monitor-933392_640.jpg",
    "https://cdn.pixabay.com/photo/2021/08/01/18/41/computer-6515023_640.jpg",
    "https://cdn.pixabay.com/photo/2024/01/05/18/47/technology-8490011_640.png",
    "https://cdn.pixabay.com/photo/2020/01/12/13/22/photoshop-4759955_640.jpg",
    "https://cdn.pixabay.com/photo/2024/10/30/02/18/transformation-9160373_640.jpg",
    "https://i.pinimg.com/736x/cb/aa/14/cbaa149c6ace42845cd3d5ca58ba4b7b.jpg",
    "https://i.pinimg.com/1200x/c5/db/94/c5db9406290f69425940b4126a0dfc6e.jpg",
    "https://i.pinimg.com/736x/3b/83/61/3b8361af32773621d3a8315596b19515.jpg",
    "https://i.pinimg.com/1200x/2f/bc/60/2fbc603a000ae3256e183492b83176df.jpg",
    "https://i.pinimg.com/1200x/52/07/b6/5207b6f938f15f95f3a758e3637afaf8.jpg",
    "https://i.pinimg.com/1200x/b4/e0/5a/b4e05ad68d75f7c0ba522b45873e4ca7.jpg",
    "https://i.pinimg.com/1200x/58/19/08/5819084e975ec9798abc578c50dfc207.jpg",
    "https://i.pinimg.com/736x/59/69/19/596919a3663e7265b2e3267c2e36352d.jpg",
    "https://i.pinimg.com/736x/94/95/ae/9495ae871d1257d972cd1d7793301c9c.jpg",
    "https://i.pinimg.com/736x/21/ef/de/21efde32792d004870c74446ad8e90fd.jpg",
    "https://i.pinimg.com/1200x/7b/d8/6a/7bd86ad825963b9d0ae32192f19dc50e.jpg",
    "https://i.pinimg.com/1200x/7b/d8/6a/7bd86ad825963b9d0ae32192f19dc50e.jpg",
    "https://i.pinimg.com/1200x/98/53/9d/98539dc21fe3a9983916575afca4bfdf.jpg",
    "https://i.pinimg.com/1200x/6a/cb/52/6acb52318358074bfd29c754bcf6c68e.jpg",
    "https://i.pinimg.com/1200x/e3/08/1f/e3081fd8e51d6aa77900e72437a8a7f6.jpg",
    "https://i.pinimg.com/1200x/24/c3/2d/24c32d3101050932c56d7fe08ed07fb2.jpg",
    "https://i.pinimg.com/736x/41/78/11/417811dc6a0e53d37148136be49df17d.jpg",
  ];
  return (
    <>
      <div className="relative mx-auto  flex h-screen w-full flex-col items-center justify-center overflow-hidden ">
        <h2 className="relative z-20 mx-auto max-w-5xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
          Level Up Your Skills
          <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
            Transform
          </span>{" "}
          Your Career
        </h2>
        <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
          Choose from hundreds of expert-designed courses and start learning
          today.
        </p>

        <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/log-in">
            <button className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer">
              LogIn
            </button>
          </Link>
          <Link href="/send-mail">
            <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer">
              SignUp
            </button>
          </Link>
        </div>

        {/* overlay */}
        <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
        <ThreeDMarquee
          className="pointer-events-none absolute inset-0 h-full w-full scale-160"
          images={images}
        />
      </div>
    </>
  );
};

export default LandingPage;
