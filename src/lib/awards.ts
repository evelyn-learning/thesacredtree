export interface Award {
  id: string;
  title: string;
  awardedBy: string;
  date: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
}

export const awards: Award[] = [
  {
    id: 'contra-costa-board-of-supervisors',
    title: 'Resolution of Recognition',
    awardedBy: 'Contra Costa County Board of Supervisors',
    date: 'September 15, 2026',
    summary:
      'By unanimous vote, the Contra Costa County Board of Supervisors recognized The Sacred Tree Foundation for its community impact in fighting hunger and food waste across East County.',
    description:
      'On September 15, 2026, the Contra Costa County Board of Supervisors unanimously passed Resolution No. 2026-358, commending The Sacred Tree Foundation “for its outstanding contributions to East County, its dedication to fighting hunger, and its inspiring leadership in empowering the next generation of youth.” The resolution recognizes founder Vanshika Tyagi, a student at Heritage High School in Brentwood, and the student volunteers who have rescued and donated more than 2,700 pounds of fresh produce to families in need.',
    image: '/images/award-contra-costa-board-of-supervisors.jpg',
    imageAlt:
      'Framed Resolution No. 2026-358 of the Contra Costa County Board of Supervisors recognizing The Sacred Tree Foundation for its community impact',
    width: 1339,
    height: 2000,
  },
  {
    id: 'california-state-senate',
    title: 'Certificate of Recognition',
    awardedBy: 'California State Senate',
    date: 'October 5, 2026',
    summary:
      'Senator Christopher Cabaldon of the Third Senate District presented The Sacred Tree with a California State Senate Certificate of Recognition for its community impact.',
    description:
      'On October 5, 2026, in Brentwood, Senator Christopher Cabaldon (Third Senate District) presented The Sacred Tree with a California State Senate Certificate of Recognition for its “outstanding service and dedication to communities in the Bay Area.” The certificate honors the leadership of founder Vanshika Tyagi and the dedication of the foundation’s student volunteers in reducing food waste, supporting local families and elevating youth leadership.',
    image: '/images/award-california-state-senate.jpg',
    imageAlt:
      'Framed California State Senate Certificate of Recognition presented to The Sacred Tree by Senator Christopher Cabaldon',
    width: 1400,
    height: 1691,
  },
];
