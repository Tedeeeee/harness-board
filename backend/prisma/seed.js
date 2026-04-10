import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const posts = [
  { title: '별소프트 홈페이지가 오픈되었습니다', content: '안녕하세요! 별소프트의 공식 홈페이지가 새롭게 오픈되었습니다.\n\n앞으로 이 공간을 통해 다양한 소식을 전해드리겠습니다. 많은 관심 부탁드립니다.', author: '관리자' },
  { title: '자유게시판 이용 안내', content: '자유게시판은 누구나 자유롭게 글을 작성하고 열람할 수 있는 공간입니다.\n\n작성 시 비밀번호를 설정하면, 해당 비밀번호로 수정/삭제가 가능합니다.\n\n건전한 게시판 문화를 위해 협조 부탁드립니다.', author: '관리자' },
  { title: '협업 관련 문의드립니다', content: '안녕하세요. 저희 회사에서 웹 개발 프로젝트를 진행하려고 하는데, 별소프트와 협업이 가능한지 문의드립니다.\n\n프로젝트 규모는 중소규모이며, React와 Node.js 기반을 고려하고 있습니다.', author: '박철수' },
  { title: '홈페이지가 깔끔하네요', content: '처음 방문했는데 디자인이 깔끔하고 정보가 잘 정리되어 있어서 좋습니다.\n\n회사 소개도 명확하고, 연락처도 바로 보여서 편리해요.', author: '이영희' },
  { title: '기술 스택이 궁금합니다', content: '별소프트에서 주로 사용하는 기술 스택이 궁금합니다.\n\nReact, Node.js 외에 다른 기술도 활용하시나요?\n\n클라우드 인프라는 어떤 것을 사용하시는지도 알고 싶습니다.', author: '정다은' },
  { title: '별소프트 신규 서비스 관련 의견', content: '최근 별소프트의 기술 블로그에서 소개된 접근 방식이 인상적이었습니다.\n\n특히 고객 중심 설계에 대한 부분이 실제 프로젝트에 어떻게 적용되는지 궁금합니다.\n\n관련해서 추가 정보를 공유해 주시면 감사하겠습니다.', author: '김민수' },
  { title: '인턴십 프로그램이 있나요?', content: '컴퓨터공학을 전공하고 있는 대학생입니다.\n\n별소프트에서 인턴십이나 실습 프로그램을 운영하시는지 궁금합니다.\n\n관련 정보가 있으면 공유 부탁드립니다.', author: '최수진' },
  { title: '웹 접근성 관련 질문', content: '별소프트 홈페이지의 웹 접근성 준수 여부가 궁금합니다.\n\n시각장애인 사용자도 이용 가능한 수준인지, WCAG 가이드라인을 따르고 있는지 알고 싶습니다.', author: '강동현' },
  { title: 'API 연동 관련 문의', content: 'REST API 개발을 의뢰하고 싶습니다.\n\n기존 시스템과의 연동이 필요한 상황인데, 별소프트에서 이런 종류의 프로젝트도 진행하시나요?\n\n견적 상담이 가능한지 알려주세요.', author: '윤서연' },
  { title: '프로젝트 후기 공유합니다', content: '별소프트와 함께 프로젝트를 진행한 적이 있는 회사입니다.\n\n커뮤니케이션이 원활하고, 일정 관리가 철저해서 만족스러운 결과를 얻었습니다.\n\n다음 프로젝트도 함께하고 싶습니다.', author: '한지민' },
  { title: '보안 관련 질문이 있습니다', content: '개인정보 처리와 관련된 보안 정책이 어떻게 되는지 궁금합니다.\n\nISO 27001이나 ISMS 인증을 보유하고 계신가요?', author: '송태영' },
  { title: '모바일 앱 개발도 가능한가요?', content: '웹 개발 외에 모바일 앱(iOS/Android) 개발도 가능한지 문의드립니다.\n\nReact Native나 Flutter 기반의 크로스플랫폼 개발 경험이 있으신가요?', author: '임하늘' },
  { title: '스타트업과의 협업 경험', content: '초기 스타트업인데, 별소프트와 협업한 스타트업 레퍼런스가 있다면 공유 부탁드립니다.\n\n예산이 제한적인 상황에서 어떤 방식으로 진행 가능한지도 궁금합니다.', author: '오준혁' },
  { title: '데이터 분석 서비스 관련', content: '데이터 수집 및 분석 대시보드 구축을 고려하고 있습니다.\n\n별소프트에서 데이터 엔지니어링이나 BI 관련 프로젝트도 수행하시나요?', author: '배유진' },
  { title: '좋은 회사인 것 같습니다', content: '홈페이지를 통해 회사의 가치관과 방향성을 잘 알 수 있었습니다.\n\n특히 "고객 중심"이라는 가치가 마음에 듭니다.\n\n앞으로도 좋은 서비스 기대합니다!', author: '나경민' },
  { title: 'DevOps 컨설팅 문의', content: 'CI/CD 파이프라인 구축과 클라우드 인프라 최적화에 대한 컨설팅이 필요합니다.\n\nAWS 환경에서의 경험이 있으신가요?', author: '유성호' },
  { title: '오픈소스 기여에 대해', content: '별소프트에서 오픈소스 프로젝트에 기여하거나 운영하는 것이 있는지 궁금합니다.\n\n개발 커뮤니티 활동에도 관심이 있습니다.', author: '장현우' },
  { title: 'UX/UI 디자인도 가능한가요?', content: '개발뿐만 아니라 UX/UI 디자인 서비스도 제공하시나요?\n\n사용자 리서치부터 프로토타이핑까지 원스톱으로 진행 가능한지 알고 싶습니다.', author: '권소희' },
];

async function main() {
  console.log('Seeding database...');

  await prisma.post.deleteMany();

  const password = bcrypt.hashSync('1234', 10);

  for (let i = 0; i < posts.length; i++) {
    const daysAgo = posts.length - i;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.post.create({
      data: {
        ...posts[i],
        password,
        views: Math.floor(Math.random() * 150) + 5,
        createdAt,
      },
    });
  }

  console.log(`Seeded ${posts.length} posts. Test password: "1234"`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
