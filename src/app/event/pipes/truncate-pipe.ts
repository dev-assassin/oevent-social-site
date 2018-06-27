import { Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'truncate'
})

export class TruncatePipe {
    transform(value: string, args: string[]): string {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 10;
        const trail = args.length > 1 ? args[1] : '...';

        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
