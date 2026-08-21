import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "hero": z.object({
        "headline": z.string(),
        "subheadline": z.string(),
        "cta1Label": z.string(),
        "cta1Href": z.string(),
        "cta2Label": z.string(),
        "cta2Href": z.string()
      }),
      "intro": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "topics": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "description": z.string(),
        "href": z.string(),
        "featured": z.boolean()
      })),
      "benefits": z.array(z.object({
        "id": z.string(),
        "stat": z.string(),
        "label": z.string(),
        "description": z.string()
      })),
      "expectations": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "intro": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "verdict": z.string(),
          "use_case": z.string(),
          "detail": z.string()
        })),
        "closing": z.string()
      }),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "buttonLabel": z.string(),
        "buttonHref": z.string()
      }),
      "newsletter": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "body": z.string(),
        "placeholder": z.string(),
        "buttonLabel": z.string(),
        "successMessage": z.string()
      })
    }),
    how_it_works: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "zones": z.array(z.object({
        "id": z.string(),
        "number": z.string(),
        "name": z.string(),
        "temp": z.string(),
        "description": z.string(),
        "detail": z.string()
      })),
      "syngas": z.object({
        "heading": z.string(),
        "body": z.string(),
        "composition": z.array(z.object({
          "id": z.string(),
          "gas": z.string(),
          "percent": z.string(),
          "note": z.string()
        }))
      }),
      "components": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "description": z.string()
      })),
      "types": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "best": z.string(),
        "pros": z.string(),
        "cons": z.string(),
        "recommended": z.boolean()
      })),
      "faq": z.array(z.object({
        "id": z.string(),
        "question": z.string(),
        "answer": z.string()
      }))
    }),
    build_guides: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "guides": z.array(z.object({
        "id": z.string(),
        "slug": z.string(),
        "tag": z.string(),
        "tagColor": z.string(),
        "title": z.string(),
        "subtitle": z.string(),
        "difficulty": z.string(),
        "timeEstimate": z.string(),
        "costEstimate": z.string(),
        "bestFor": z.string(),
        "description": z.string(),
        "materials": z.array(z.object({
          "id": z.string(),
          "item": z.string(),
          "qty": z.string()
        })),
        "tools": z.array(z.string()),
        "steps": z.array(z.object({
          "id": z.string(),
          "step": z.number(),
          "title": z.string(),
          "description": z.string()
        })),
        "tips": z.array(z.object({
          "id": z.string(),
          "tip": z.string()
        }))
      })),
      "tools_overview": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "name": z.string(),
          "note": z.string()
        }))
      })
    }),
    fuel_types: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "fuels": z.array(z.object({
        "id": z.string(),
        "name": z.string(),
        "rating": z.number(),
        "bestFor": z.string(),
        "moistureTarget": z.string(),
        "sizeTarget": z.string(),
        "description": z.string(),
        "pros": z.array(z.string()),
        "cons": z.array(z.string()),
        "notes": z.string()
      })),
      "moisture": z.object({
        "heading": z.string(),
        "body": z.string(),
        "targets": z.array(z.object({
          "id": z.string(),
          "label": z.string(),
          "range": z.string(),
          "status": z.string()
        })),
        "tips": z.array(z.object({
          "id": z.string(),
          "tip": z.string()
        }))
      }),
      "sizing": z.object({
        "heading": z.string(),
        "body": z.string(),
        "table": z.array(z.object({
          "id": z.string(),
          "gasifier": z.string(),
          "idealSize": z.string(),
          "avoid": z.string()
        }))
      }),
      "sourcing": z.object({
        "heading": z.string(),
        "intro": z.string(),
        "sources": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "quality": z.string(),
          "notes": z.string(),
          "watch_out": z.string()
        })),
        "avoid": z.object({
          "heading": z.string(),
          "items": z.array(z.object({
            "id": z.string(),
            "text": z.string()
          }))
        }),
        "storage": z.object({
          "heading": z.string(),
          "tips": z.array(z.object({
            "id": z.string(),
            "tip": z.string()
          }))
        })
      }),
      "efficiency": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "description": z.string()
        }))
      })
    }),
    safety: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "warning_banner": z.object({
        "headline": z.string(),
        "body": z.string()
      }),
      "hazards": z.array(z.object({
        "id": z.string(),
        "icon": z.string(),
        "level": z.string(),
        "title": z.string(),
        "description": z.string(),
        "rules": z.array(z.string())
      })),
      "ppe": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "item": z.string(),
          "when": z.string()
        }))
      }),
      "mistakes": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "description": z.string()
        }))
      }),
      "faq_featured": z.array(z.object({
        "id": z.string(),
        "question": z.string(),
        "answer": z.string(),
        "action_label": z.string().nullable(),
        "action_href": z.string().nullable()
      })),
      "faq": z.array(z.object({
        "id": z.string(),
        "question": z.string(),
        "answer": z.string()
      }))
    }),
    resources: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "categories": z.array(z.object({
        "id": z.string(),
        "icon": z.string(),
        "title": z.string(),
        "description": z.string(),
        "links": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "description": z.string(),
          "url": z.string(),
          "tag": z.string()
        }))
      })),
      "glossary": z.object({
        "heading": z.string(),
        "intro": z.string(),
        "terms": z.array(z.object({
          "id": z.string(),
          "term": z.string(),
          "definition": z.string()
        }))
      })
    }),
    troubleshooting: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "problems": z.array(z.object({
        "id": z.string(),
        "category": z.string(),
        "title": z.string(),
        "severity": z.string(),
        "symptoms": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "causes": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "solutions": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      })),
      "tips": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "link1Label": z.string(),
        "link1Href": z.string(),
        "link2Label": z.string(),
        "link2Href": z.string()
      })
    }),
    about: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string()
      }),
      "mission": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "principles": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "body": z.string()
      })),
      "approach": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "disclaimer": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "link1Label": z.string(),
        "link2Label": z.string()
      })
    }),
    legal: z.object({
      "meta": z.object({
        "title": z.string(),
        "description": z.string()
      }),
      "hero": z.object({
        "eyebrow": z.string(),
        "title": z.string(),
        "subtitle": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "sections": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "icon": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "checklist": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      })),
      "howToCheck": z.object({
        "heading": z.string(),
        "steps": z.array(z.object({
          "id": z.string(),
          "step": z.string(),
          "title": z.string(),
          "body": z.string()
        }))
      }),
      "disclaimer": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "linkLabel": z.string()
      })
    }),
    maintenance: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "schedules": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "timing": z.string(),
        "color": z.string(),
        "icon": z.string(),
        "tasks": z.array(z.object({
          "id": z.string(),
          "task": z.string(),
          "critical": z.boolean()
        }))
      })),
      "consumables": z.object({
        "heading": z.string(),
        "intro": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "item": z.string(),
          "interval": z.string(),
          "cost": z.string()
        }))
      }),
      "log_tip": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "link1Label": z.string(),
        "link1Href": z.string(),
        "link2Label": z.string(),
        "link2Href": z.string()
      })
    }),
    real_builds: z.object({
      "hero": z.object({
        "eyebrow": z.string(),
        "heading": z.string(),
        "subheading": z.string()
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.string()
      }),
      "builds": z.array(z.object({
        "id": z.string(),
        "builder": z.string(),
        "location": z.string(),
        "type": z.string(),
        "slug": z.string(),
        "tagColor": z.string(),
        "timeToComplete": z.string(),
        "totalCost": z.string(),
        "purpose": z.string(),
        "summary": z.string(),
        "story": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "lessons": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        })),
        "performance": z.string(),
        "would_do_differently": z.string()
      })),
      "submit_cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "email": z.string()
      })
    }),
    simulator: z.object({
      "hero": z.object({
        "badge": z.string(),
        "title": z.string(),
        "description": z.string()
      }),
      "inputs": z.object({
        "heading": z.string(),
        "gasifierTypeLabel": z.string(),
        "fuelTypeLabel": z.string(),
        "blendToggleLabel": z.string(),
        "blendToggleHelp": z.string(),
        "secondFuelLabel": z.string(),
        "blendRatioLabel": z.string(),
        "blendRatioHelp": z.string(),
        "moistureLabel": z.string(),
        "moistureDryLabel": z.string(),
        "moistureLimitLabel": z.string(),
        "moistureMaxLabel": z.string(),
        "fuelSizeLabel": z.string(),
        "erLabel": z.string(),
        "erRichLabel": z.string(),
        "erTypicalLabel": z.string(),
        "erLeanLabel": z.string(),
        "erHelp": z.string(),
        "engineToggleLabel": z.string(),
        "engineToggleHelp": z.string(),
        "engineDisplacementLabel": z.string(),
        "engineDisplacementHelp": z.string(),
        "engineRpmLabel": z.string(),
        "runButton": z.string(),
        "runningButton": z.string()
      }),
      "enginePresets": z.array(z.object({
        "id": z.string(),
        "label": z.string(),
        "cc": z.number(),
        "rpm": z.number()
      })),
      "compare": z.object({
        "heading": z.string(),
        "subheading": z.string(),
        "runButton": z.string(),
        "runningButton": z.string(),
        "rankLabel": z.string(),
        "fuelLabel": z.string(),
        "lhvLabel": z.string(),
        "cgeLabel": z.string(),
        "tarLabel": z.string(),
        "powerLabel": z.string(),
        "engineSafeLabel": z.string(),
        "bestBadge": z.string(),
        "summaryHeading": z.string()
      }),
      "gasifierTypes": z.array(z.object({
        "id": z.string(),
        "label": z.string()
      })),
      "fuelTypes": z.array(z.object({
        "id": z.string(),
        "label": z.string()
      })),
      "results": z.object({
        "emptyHeading": z.string(),
        "emptyHighlight": z.string(),
        "emptyTail": z.string(),
        "compositionHeading": z.string(),
        "compositionNote": z.string(),
        "lhvLabel": z.string(),
        "lhvUnit": z.string(),
        "lhvSub": z.string(),
        "cgeLabel": z.string(),
        "cgeUnit": z.string(),
        "cgeSub": z.string(),
        "yieldLabel": z.string(),
        "yieldUnit": z.string(),
        "yieldSub": z.string(),
        "powerLabel": z.string(),
        "powerUnit": z.string(),
        "powerSub": z.string()
      }),
      "methodology": z.object({
        "heading": z.string(),
        "body1": z.string(),
        "body1Bold": z.string(),
        "body2": z.string(),
        "body2Bold": z.string(),
        "body2Tail": z.string(),
        "body3": z.string()
      })
    })
  }
};
export type Schemas = typeof schemas;