// ABOUTME: Logbook search tool for Things3 completed items
// ABOUTME: Provides searching through completed tasks with date range filtering

import { BaseTool, ToolRegistration } from '../base/tool-base.js';
import * as templates from '../templates/applescript-templates.js';
import { LogbookSearchParams } from '../types/tools.js';
import { TodoItem } from '../types/models.js';
import { isoToAppleScriptDate } from '../utils/date-handler.js';

export class LogbookTools extends BaseTool {
  constructor() {
    super('logbook');
  }

  /**
   * Search completed items in the logbook
   */
  async search(params: LogbookSearchParams = {}): Promise<{ items: Partial<TodoItem>[] }> {
    // Convert dates to AppleScript format if provided
    let fromDateScript: string | undefined;
    let toDateScript: string | undefined;

    if (params.fromDate) {
      fromDateScript = isoToAppleScriptDate(params.fromDate);
    }

    if (params.toDate) {
      toDateScript = isoToAppleScriptDate(params.toDate);
    }

    const script = templates.searchLogbook(
      params.searchText,
      fromDateScript,
      toDateScript,
      params.limit
    );

    const result = await this.bridge.execute(script);

    try {
      const parsedResult = JSON.parse(result);
      
      // Convert the results to TodoItem format
      const items = parsedResult.map((item: Record<string, unknown>) => ({
        id: item['id'],
        title: item['title'],
        notes: item['notes'],
        completed: true,
        completionDate: item['completionDate'],
        projectName: item['projectName']
      }));

      return { items };
    } catch (error) {
      console.error('Failed to parse logbook search results:', error);
      return { items: [] };
    }
  }

  /**
   * Get tool registrations for the registry
   */
  getToolRegistrations(): ToolRegistration[] {
    return [
      {
        name: 'logbook_search',
        handler: this.search.bind(this),
        toolDefinition: {
          name: 'logbook_search',
          description: 'Search completed items in the logbook with optional filters',
          inputSchema: {
            type: 'object',
            properties: {
              searchText: {
                type: 'string',
                description: 'Text to search for in title or notes'
              },
              fromDate: {
                type: 'string',
                description: 'Start date for completion date filter (ISO 8601 format)'
              },
              toDate: {
                type: 'string',
                description: 'End date for completion date filter (ISO 8601 format)'
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (default: 100)',
                minimum: 1,
                maximum: 1000
              }
            }
          }
        }
      }
    ];
  }
}