import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import 'stylesheet/main.scss';
import { Helmet } from 'react-helmet';

export default class Layout extends React.Component {
	componentDidMount() {
		CommonLayout.init();
	}
	componentWillUnmount() {
		CommonLayout.exit();
	}
	render() {
		const props = this.props;

		return (
            <StaticQuery
				query={query}
				render={(data) => {
					const webname = data.setting.frontmatter.title;
					let seo_image = '';
					if (data.setting.frontmatter.seo.seo_image) {
						seo_image = `https://gemasemesta.co${data.setting.frontmatter.seo.seo_image.childImageSharp.gatsbyImageData.src}`;
					}
					const seo = {
						desc:  data.setting.frontmatter.seo.seo_shortdesc,
						keywords: data.setting.frontmatter.seo.seo_keywords,
						image: seo_image,
						url: 'https://gemasemesta.co'
					};
					return (
						<div className={props.className} id="Layout">
							<Helmet>
								<title>{props.titleText ? `${props.titleText} | ${webname}` : webname}</title>
								<meta name="description" content={seo.desc} />
								<meta name="image" content={seo.image} />
								<meta name="keywords" content={seo.keywords} />
								{seo.url && <meta property="og:url" content={seo.url} />}

								{props.titleText ? (
									<meta property="og:title" content={`${props.titleText} | ${webname}`} />
								) : (
									<meta property="og:title" content={webname} />
								)}
								{seo.desc && <meta property="og:description" content={seo.desc} />}
								{seo.image && <meta property="og:image" content={seo.image} />}
								<meta name="twitter:card" content="summary_large_image" />

								{props.titleText ? (
									<meta property="twitter:title" content={`${props.titleText} | ${webname}`} />
								) : (
									<meta property="twitter:title" content={webname} />
								)}
								{seo.desc && <meta name="twitter:description" content={seo.desc} />}
								{seo.image && <meta name="twitter:image" content={seo.image} />}
							</Helmet>
							{props.children}
						</div>
					);
				}}
			/>
        );
	}
}

const query = graphql`{
  setting: markdownRemark(
    frontmatter: {issetting: {eq: true}, contenttype: {eq: "general_setting"}}
  ) {
    frontmatter {
      title
      seo {
        seo_image {
          childImageSharp {
            gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH)
          }
        }
        seo_keywords
        seo_shortdesc
      }
    }
  }
}
`;


const CommonLayout = {
	init: () => {
		CommonLayout.initTimeout = setTimeout(() => {
			if (typeof document !== `undefined`) {
				document.body.classList.remove('loading');
			}
		}, 500);

		if (typeof document !== `undefined`) {
			document.querySelector('div#Layout').style.minHeight =  window.innerHeight.toString() + 'px';
		}
		CommonLayout.resizeAdd();
	},
	initTimeout: null,
	exit: () => {
		clearTimeout(CommonLayout.initTimeout);
		CommonLayout.initTimeout = null;
		CommonLayout.resizeRemove();
	},
	resize: () => {
		const resizeFunction = () => {
			if (typeof document !== `undefined`) {
				document.querySelector('div#Layout').style.minHeight =  window.innerHeight.toString() + 'px';
			}
		};
		resizeFunction();
	},
	resizeInit: false,
	resizeAdd: () => {
		if (typeof window !== `undefined`) {
			if (!CommonLayout.resizeInit) {
				CommonLayout.resizeInit = true;
				window.addEventListener('resize', CommonLayout.resize, { passive: true });
			}
		}
	},
	resizeRemove: () => {
		if (typeof window !== `undefined`) {
			CommonLayout.resizeInit = false;
			window.removeEventListener('resize', CommonLayout.resize, { passive: true });
		}
	}
}
