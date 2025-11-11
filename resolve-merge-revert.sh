#!/bin/bash

# Script to resolve the merge-revert issue with Alex-Jakob-MQ branch
# This script provides options to fix the "no differences" problem when trying
# to merge a previously merged and reverted branch

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Git Merge-Revert Resolution Script                           ║"
echo "║  For: Alex-Jakob-MQ branch issue                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

print_info "Current branch: $(git branch --show-current)"
print_info "Current commit: $(git rev-parse --short HEAD)"
echo ""

# Explain the issue
echo "═══════════════════════════════════════════════════════════════"
echo "PROBLEM:"
echo "  The Alex-Jakob-MQ branch was merged to dev, then reverted."
echo "  Git now thinks all changes from that branch have been 'seen'"
echo "  and won't merge them again, showing 'no differences'."
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Show the solutions
echo "AVAILABLE SOLUTIONS:"
echo ""
echo "1) Revert the Revert (RECOMMENDED)"
echo "   - Simplest solution"
echo "   - Brings back all original changes"
echo "   - Preserves history"
echo "   - Executes: git revert 17c497a075432ada77bb50a67e1ac359e9bf6ee5"
echo ""
echo "2) Cherry-pick to New Branch"
echo "   - Create fresh commits with the same changes"
echo "   - More control over which changes to include"
echo "   - Executes: git cherry-pick 67738579a84f5c0b4100210dbcdeebc14548e03a"
echo ""
echo "3) Show Analysis Only"
echo "   - Don't make any changes"
echo "   - Just show the current state and what would happen"
echo ""
echo "4) Exit"
echo "   - Exit without making changes"
echo ""

# Get user choice
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_info "Option 1: Revert the Revert"
        echo ""
        
        # Safety check
        current_branch=$(git branch --show-current)
        if [ "$current_branch" != "dev" ]; then
            print_warning "You are not on the 'dev' branch (current: $current_branch)"
            read -p "Do you want to switch to dev? (y/n): " switch_branch
            if [ "$switch_branch" = "y" ] || [ "$switch_branch" = "Y" ]; then
                print_info "Switching to dev branch..."
                git checkout dev
                git pull origin dev
            else
                print_error "Aborted. Please switch to dev branch manually."
                exit 1
            fi
        fi
        
        print_warning "This will revert commit 17c497a, bringing back all changes from Alex-Jakob-MQ"
        read -p "Are you sure you want to continue? (y/n): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            print_info "Reverting the revert commit..."
            git revert 17c497a075432ada77bb50a67e1ac359e9bf6ee5
            
            print_info "✓ Revert of revert completed!"
            print_info "Next steps:"
            echo "  1. Review the changes: git diff HEAD~1"
            echo "  2. If satisfied, push: git push origin dev"
            echo "  3. Or if you want to undo: git reset --hard HEAD~1"
        else
            print_warning "Aborted by user"
        fi
        ;;
        
    2)
        print_info "Option 2: Cherry-pick to New Branch"
        echo ""
        
        # Get current branch
        current_branch=$(git branch --show-current)
        if [ "$current_branch" != "dev" ]; then
            print_warning "You are not on the 'dev' branch (current: $current_branch)"
            read -p "Do you want to switch to dev? (y/n): " switch_branch
            if [ "$switch_branch" = "y" ] || [ "$switch_branch" = "Y" ]; then
                print_info "Switching to dev branch..."
                git checkout dev
                git pull origin dev
            else
                print_error "Aborted. Please switch to dev branch manually."
                exit 1
            fi
        fi
        
        # Suggest branch name
        new_branch="Alex-Jakob-MQ-v2"
        read -p "Enter name for new branch (default: $new_branch): " input_branch
        if [ ! -z "$input_branch" ]; then
            new_branch="$input_branch"
        fi
        
        print_info "Creating new branch: $new_branch"
        git checkout -b "$new_branch"
        
        print_info "Cherry-picking commit 67738579a84f5c0b4100210dbcdeebc14548e03a..."
        if git cherry-pick 67738579a84f5c0b4100210dbcdeebc14548e03a; then
            print_info "✓ Cherry-pick completed successfully!"
            print_info "Next steps:"
            echo "  1. Review the changes: git log -1 -p"
            echo "  2. Push the branch: git push origin $new_branch"
            echo "  3. Create a new PR from $new_branch to dev"
        else
            print_error "Cherry-pick failed. You may need to resolve conflicts."
            print_info "After resolving conflicts:"
            echo "  1. git add <resolved-files>"
            echo "  2. git cherry-pick --continue"
        fi
        ;;
        
    3)
        print_info "Option 3: Analysis Only"
        echo ""
        
        print_info "Current Repository State:"
        echo ""
        echo "Branches involved:"
        git log --oneline --graph --decorate -10 --all | grep -E "(dev|Alex-Jakob-MQ|revert)" || echo "  (showing all recent commits)"
        git log --oneline --graph --decorate -10 --all
        echo ""
        
        print_info "Checking if Alex-Jakob-MQ can be merged to dev..."
        git checkout dev 2>/dev/null || print_warning "Could not checkout dev branch"
        
        # Simulate merge
        print_info "Simulating merge (no changes will be made):"
        git merge --no-commit --no-ff Alex-Jakob-MQ 2>&1 || true
        git merge --abort 2>/dev/null || true
        
        echo ""
        print_info "Commit details:"
        echo ""
        echo "Original merge commit:"
        git log --oneline -1 5cdf1c22 2>/dev/null || echo "  Could not find commit 5cdf1c22"
        echo ""
        echo "Revert commit:"
        git log --oneline -1 7304417 2>/dev/null || echo "  Could not find commit 7304417"
        echo ""
        echo "Revert merge commit:"
        git log --oneline -1 17c497a 2>/dev/null || echo "  Could not find commit 17c497a"
        echo ""
        
        print_info "Analysis complete. No changes were made."
        ;;
        
    4)
        print_info "Exiting without changes"
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_info "Script completed!"
