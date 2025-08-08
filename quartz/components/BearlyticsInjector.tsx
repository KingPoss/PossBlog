import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const BearlyticsInjector: QuartzComponent = ({ fileData, externalResources }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title ?? "Untitled"
    const description = fileData.description?.trim() ?? "No description provided"
    
    return (
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <title>{title}</title>
        
        {/* Standard Quartz CSS resources */}
        {externalResources.css.map((href, i) => (
          <link 
            key={i} 
            href={String(href)} 
            rel="stylesheet" 
            type="text/css" 
            spa-preserve 
          />
        ))}
        
        {/* JavaScript resources that need to load before DOM */}
        {externalResources.js
          .filter((js) => js.loadTime === "beforeDOMReady")
          .map((js, i) => {
            if (js.contentType === "external") {
              return (
                <script
                  key={`js-${i}`}
                  src={js.src}
                  type={js.moduleType === "module" ? "module" : "text/javascript"}
                  spa-preserve
                />
              )
            } else {
              // Inline script
              return (
                <script
                  key={`inline-${i}`}
                  type={js.moduleType === "module" ? "module" : "text/javascript"}
                  spa-preserve
                  dangerouslySetInnerHTML={{ __html: js.script }}
                />
              )
            }
          })}
        
        {/* Bearlytics Analytics Script */}
        <script 
          data-site="RRZKQSF" 
          src="https://analytics.kingposs.com/script.js" 
          defer 
        />
      </head>
    )
  }

  return BearlyticsInjector
}) satisfies QuartzComponentConstructor