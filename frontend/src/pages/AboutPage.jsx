export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          기술로 가치를 만드는 팀, 별소프트
        </h1>
        <p className="text-base text-gray-500 max-w-lg mx-auto">
          고객의 문제를 깊이 이해하고, 실질적인 솔루션을 설계합니다.
        </p>
      </section>

      {/* Value Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="border border-gray-200 rounded bg-white p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">고객 중심</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            고객의 언어로 문제를 정의하고, 고객이 체감하는 결과로 증명합니다.
          </p>
        </div>
        <div className="border border-gray-200 rounded bg-white p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">실용적 기술</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            유행이 아닌 목적에 맞는 기술을 선택하고, 단순한 구조를 지향합니다.
          </p>
        </div>
        <div className="border border-gray-200 rounded bg-white p-5">
          <h3 className="font-semibold text-sm text-gray-900 mb-2">신뢰와 투명성</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            일하는 방식과 진행 상황을 투명하게 공유합니다.
          </p>
        </div>
      </section>

      {/* Company Info */}
      <section className="border border-gray-200 rounded bg-white p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">회사 정보</h2>
        <dl className="divide-y divide-gray-100">
          {[
            ['회사명', '별소프트'],
            ['대표', '홍길동'],
            ['주소', '서울특별시 강남구 테헤란로 123'],
            ['이메일', 'contact@byulsoft.com'],
            ['전화', '02-1234-5678'],
          ].map(([label, value]) => (
            <div key={label} className="flex py-2.5 text-sm">
              <dt className="w-20 text-gray-400 shrink-0">{label}</dt>
              <dd className="text-gray-700">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact CTA */}
      <section className="text-center border-2 border-gray-900 rounded p-8 mb-12 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          프로젝트가 있으신가요?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          별소프트와 함께 이야기 나눠보세요.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="mailto:contact@byulsoft.com"
            className="inline-block px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800"
          >
            이메일 문의
          </a>
          <a
            href="tel:02-1234-5678"
            className="inline-block px-6 py-2.5 border-2 border-gray-900 text-gray-900 text-sm font-medium rounded hover:bg-gray-50"
          >
            전화 연결
          </a>
        </div>
      </section>
    </div>
  );
}
