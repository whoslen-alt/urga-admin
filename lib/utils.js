import parse from 'html-react-parser';
import sanitizeHtml from 'sanitize-html';

export const htmlFrom = (htmlString) => {
  const cleanHtmlString = sanitizeHtml(htmlString);
  const html = parse(cleanHtmlString, {});
  return html;
};
