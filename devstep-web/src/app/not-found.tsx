export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-4xl font-outfit font-bold text-gray-800">404</h1>
      <p className="text-gray-500">요청하신 페이지를 찾을 수 없습니다.</p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
