import { PageLayout, SharedLayout, FullPageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import CustomPageWrapper from "./quartz/components/CustomPageWrapper"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({ links: {} }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
      ],
    }),
    Component.Explorer({    
  sortFn: (a, b) => {    
    // First, sort folders before files    
    if (a.isFolder && !b.isFolder) return -1    
    if (!a.isFolder && b.isFolder) return 1    
        
    // If both are folders, sort alphabetically    
    if (a.isFolder && b.isFolder) {    
      return a.displayName.localeCompare(b.displayName, undefined, {    
        numeric: true,    
        sensitivity: "base",    
      })    
    }    
        
    // If both are files, sort by creation date (newest first)  
    const aCreated = a.data?.date  // Changed from frontmatter.created  
    const bCreated = b.data?.date  // Changed from frontmatter.created  
        
    if (aCreated && bCreated) {    
      return new Date(bCreated).getTime() - new Date(aCreated).getTime()    
    }    
        
    // If only one has a creation date, prioritize it    
    if (aCreated && !bCreated) return -1    
    if (!aCreated && bCreated) return 1    
        
    // Fallback to alphabetical sorting    
    return a.displayName.localeCompare(b.displayName, undefined, {    
      numeric: true,    
      sensitivity: "base",    
    })    
  },    
})
,
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
      ],
    }),
    Component.Explorer({    
  sortFn: (a, b) => {    
    // First, sort folders before files    
    if (a.isFolder && !b.isFolder) return -1    
    if (!a.isFolder && b.isFolder) return 1    
        
    // If both are folders, sort alphabetically    
    if (a.isFolder && b.isFolder) {    
      return a.displayName.localeCompare(b.displayName, undefined, {    
        numeric: true,    
        sensitivity: "base",    
      })    
    }    
        
    // If both are files, sort by creation date (newest first)  
    const aCreated = a.data?.date  // Changed from frontmatter.created  
    const bCreated = b.data?.date  // Changed from frontmatter.created  
        
    if (aCreated && bCreated) {    
      return new Date(bCreated).getTime() - new Date(aCreated).getTime()    
    }    
        
    // If only one has a creation date, prioritize it    
    if (aCreated && !bCreated) return -1    
    if (!aCreated && bCreated) return 1    
        
    // Fallback to alphabetical sorting    
    return a.displayName.localeCompare(b.displayName, undefined, {    
      numeric: true,    
      sensitivity: "base",    
    })    
  },    
})
,
  ],
  right: [],
}

const fullPageLayout: FullPageLayout = {
  head: Component.Head(),
  header: [],
  beforeBody: [],
  pageBody: CustomPageWrapper,
  afterBody: [],
  left: defaultContentPageLayout.left,
  right: defaultContentPageLayout.right,
  footer: Component.Footer({ links: {} }),
}

export default fullPageLayout