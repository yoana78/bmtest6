import { PROD_ORIGIN, REDIRECT_HOSTS, matchRoute, renderPage, notFound } from "./_lib/seo.js";

// 검색 노출(SEO)용 라우팅: 페이지·제품·브랜드·영문(/en) 주소를 서버에서 렌더링한다.
// (이 저장소의 D1 테이블은 어드민이 먼저 만들어 두므로 스키마 생성은 여기서 하지 않는다)
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) return context.next();
  if (request.method !== "GET" && request.method !== "HEAD") return context.next();

  if (REDIRECT_HOSTS.includes(url.hostname)) return Response.redirect(PROD_ORIGIN + url.pathname + url.search, 301);
  if (url.pathname === "/robots.txt" || url.pathname === "/sitemap.xml") return context.next();

  const route = matchRoute(url.pathname);
  if (!route) return context.next();
  if (route.kind === "redirect") return Response.redirect(url.origin + route.to + url.search, 301);
  if (route.kind === "notfound") return notFound(context);
  return renderPage(context, route);
}
