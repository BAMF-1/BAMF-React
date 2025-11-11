# BAMF-REACT
The React webbapp for our website BAMF

## ⚠️ Important: Merge-Revert Issue Resolution

If you're trying to merge the `Alex-Jakob-MQ` branch into `dev` and seeing "no differences" or "Already up to date", see:

- **Quick Fix**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Full Guide**: [MERGE_REVERT_ISSUE_GUIDE.md](./MERGE_REVERT_ISSUE_GUIDE.md)
- **Interactive Tool**: Run `./resolve-merge-revert.sh`

**TL;DR**: Run this command to restore the changes:
```bash
git checkout dev
git pull origin dev
git revert 17c497a075432ada77bb50a67e1ac359e9bf6ee5
git push origin dev
```
